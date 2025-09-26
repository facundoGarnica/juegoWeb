<?php

namespace App\Controller;

use App\Entity\UserLevel;
use App\Entity\Player;
use App\Entity\Level;
use App\Entity\Game;
use App\Form\UserLevel1Type;
use App\Repository\UserLevelRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

#[Route('/user/level')]
class UserLevelController extends AbstractController
{
    #[Route('/', name: 'app_user_level_index', methods: ['GET'])]
    public function index(UserLevelRepository $userLevelRepository): Response
    {
        return $this->render('user_level/index.html.twig', [
            'user_levels' => $userLevelRepository->findAll(),
        ]);
    }
    
    #[Route('/save/{playerId}', name: 'app_userlevel_save', methods: ['POST'])]
    public function saveUserLevel(
        int $playerId,
        EntityManagerInterface $entityManager
    ): Response
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json([
                'success' => false,
                'message' => 'Usuario no autenticado'
            ], Response::HTTP_FORBIDDEN);
        }

        $player = $entityManager->getRepository(Player::class)->find($playerId);
        if (!$player) {
            return $this->json([
                'success' => false,
                'message' => 'Jugador no encontrado'
            ], Response::HTTP_BAD_REQUEST);
        }

        $game = $entityManager->getRepository(Game::class)->find(1); // ID fijo 1
        if (!$game) {
            return $this->json([
                'success' => false,
                'message' => 'Juego no encontrado'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // 🔹 CORREGIDO: Crear nuevo UserLevel con User
        $userLevel = new UserLevel();
        $userLevel->setPlayer($player)
                ->setUser($user) // 🔹 Asignar el usuario autenticado
                ->setGame($game)
                ->setCompletado(false)     // por defecto
                ->setTiempoUsado(0)
                ->setPuntosObtenidos(0);

        $entityManager->persist($userLevel);
        $entityManager->flush();

        return $this->json([
            'success' => true,
            'data' => [
                'userLevelId' => $userLevel->getId(),
                'playerId' => $player->getId(),
                'gameId' => $game->getId(),
                'userId' => $user->getId() // 🔹 Incluir ID del usuario
            ]
        ]);
    }

    #[Route('/new', name: 'app_user_level_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $userLevel = new UserLevel();
        $form = $this->createForm(UserLevel1Type::class, $userLevel);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // 🔹 Si no se asigna usuario en el form, usar el usuario autenticado
            if (!$userLevel->getUser()) {
                $userLevel->setUser($this->getUser());
            }
            
            $entityManager->persist($userLevel);
            $entityManager->flush();

            return $this->redirectToRoute('app_user_level_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('user_level/new.html.twig', [
            'user_level' => $userLevel,
            'form' => $form,
        ]);
    }

    #[Route('/save', name: 'app_user_level_save', methods: ['POST'])]
    public function save(Request $request, UserLevelRepository $userLevelRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json([
                'success' => false,
                'message' => 'Usuario no autenticado'
            ], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['playerId'], $data['levelId'], $data['puntosObtenidos'], $data['tiempoUsado'], $data['completado'])) {
            return $this->json([
                'success' => false,
                'message' => 'Faltan datos obligatorios'
            ], Response::HTTP_BAD_REQUEST);
        }

        $playerId = $data['playerId'];
        $levelId = $data['levelId'];
        $puntos = (int) $data['puntosObtenidos'];
        $tiempo = (int) $data['tiempoUsado'];
        $completado = (bool) $data['completado'];

        // 🔹 CORREGIDO: Buscar UserLevel por usuario autenticado, player y level
        $userLevel = $userLevelRepository->findOneBy([
            'user' => $user,
            'player' => $playerId,
            'level' => $levelId
        ]);

        if ($userLevel) {
            // Si existe, solo actualizar si el nuevo puntaje es mayor
            if ($puntos > $userLevel->getPuntosObtenidos()) {
                $userLevel->setPuntosObtenidos($puntos)
                        ->setTiempoUsado($tiempo)
                        ->setCompletado($completado);
                $entityManager->flush();
            }
        } else {
            // Si no existe, crear uno nuevo
            $player = $entityManager->getRepository(Player::class)->find($playerId);
            $level = $entityManager->getRepository(Level::class)->find($levelId);

            if (!$player || !$level) {
                return $this->json([
                    'success' => false,
                    'message' => 'Jugador o nivel no encontrados'
                ], Response::HTTP_BAD_REQUEST);
            }

            $userLevel = new UserLevel();
            $userLevel->setPlayer($player)
                    ->setLevel($level)
                    ->setUser($user) // 🔹 Asignar el usuario autenticado
                    ->setPuntosObtenidos($puntos)
                    ->setTiempoUsado($tiempo)
                    ->setCompletado($completado);

            $entityManager->persist($userLevel);
            $entityManager->flush();
        }

        return $this->json([
            'success' => true,
            'data' => [
                'id' => $userLevel->getId(),
                'puntosObtenidos' => $userLevel->getPuntosObtenidos(),
                'tiempoUsado' => $userLevel->getTiempoUsado(),
                'completado' => $userLevel->isCompletado(),
                'userId' => $userLevel->getUser()->getId(),
                'username' => $userLevel->getUser()->getUsername()
            ]
        ]);
    }

    #[Route('/player/{playerId}/level/{levelId}', name: 'app_user_level_by_player_and_level', methods: ['GET'])]
    public function getPlayerLevelByUserAndLevel(
        int $playerId,
        int $levelId,
        UserLevelRepository $userLevelRepository
    ): JsonResponse {
        $user = $this->getUser();
        if (!$user) {
            return $this->json([
                'success' => false,
                'message' => 'Usuario no autenticado'
            ], Response::HTTP_FORBIDDEN);
        }

        // 🔹 CORREGIDO: Buscar por usuario autenticado, player y level
        $userLevel = $userLevelRepository->findOneBy([
            'user' => $user,
            'player' => $playerId,
            'level' => $levelId
        ]);

        if (!$userLevel) {
            return $this->json([
                'success' => false,
                'data' => null,
                'message' => 'No se encontró progreso para este jugador en este nivel',
            ], Response::HTTP_OK);
        }

        return $this->json([
            'success' => true,
            'data' => [
                'id' => $userLevel->getId(),
                'completado' => $userLevel->isCompletado(),
                'tiempo_usado' => $userLevel->getTiempoUsado(),
                'puntos_obtenidos' => $userLevel->getPuntosObtenidos(),
                'playerId' => $userLevel->getPlayer()->getId(),
                'playerNombre' => $userLevel->getPlayer()->getNombre(),
                'levelId' => $userLevel->getLevel()->getId(),
                'levelNombre' => $userLevel->getLevel()->getNombre(),
                'userId' => $userLevel->getUser()->getId(), // 🔹 Usuario específico
                'username' => $userLevel->getUser()->getUsername() // 🔹 Username específico
            ]
        ]);
    }

    // 🔹 NUEVO ENDPOINT: Obtener UserLevels del usuario autenticado
    #[Route('/my-progress', name: 'app_user_level_my_progress', methods: ['GET'])]
    public function getMyProgress(UserLevelRepository $userLevelRepository): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json([
                'success' => false,
                'message' => 'Usuario no autenticado'
            ], Response::HTTP_FORBIDDEN);
        }

        $userLevels = $userLevelRepository->findBy(['user' => $user]);

        $data = [];
        foreach ($userLevels as $ul) {
            $data[] = [
                'id' => $ul->getId(),
                'completado' => $ul->isCompletado(),
                'tiempo_usado' => $ul->getTiempoUsado(),
                'puntos_obtenidos' => $ul->getPuntosObtenidos(),
                'player' => $ul->getPlayer()->getNombre(),
                'level' => $ul->getLevel()->getNombre(),
                'game' => $ul->getGame() ? $ul->getGame()->getNombre() : null
            ];
        }

        return $this->json([
            'success' => true,
            'data' => $data
        ]);
    }

    // ✅ Rutas con parámetros AL FINAL (después de las rutas específicas)
    #[Route('/{id}', name: 'app_user_level_show', methods: ['GET'])]
    public function show(UserLevel $userLevel): Response
    {
        return $this->render('user_level/show.html.twig', [
            'user_level' => $userLevel,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_user_level_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, UserLevel $userLevel, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(UserLevel1Type::class, $userLevel);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_user_level_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('user_level/edit.html.twig', [
            'user_level' => $userLevel,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_user_level_delete', methods: ['POST'])]
    public function delete(Request $request, UserLevel $userLevel, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$userLevel->getId(), $request->request->get('_token'))) {
            $entityManager->remove($userLevel);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_user_level_index', [], Response::HTTP_SEE_OTHER);
    }
}