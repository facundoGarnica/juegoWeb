<?php

namespace App\Controller;

use App\Entity\UserLevel;
use App\Entity\Player;
use App\Entity\Level;
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

    #[Route('/new', name: 'app_user_level_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $userLevel = new UserLevel();
        $form = $this->createForm(UserLevel1Type::class, $userLevel);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($userLevel);
            $entityManager->flush();

            return $this->redirectToRoute('app_user_level_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('user_level/new.html.twig', [
            'user_level' => $userLevel,
            'form' => $form,
        ]);
    }

    // ✅ IMPORTANTE: Rutas específicas ANTES de las rutas con parámetros
    #[Route('/save', name: 'app_user_level_save', methods: ['POST'])]
    public function save(Request $request, UserLevelRepository $userLevelRepository, EntityManagerInterface $entityManager): JsonResponse
    {
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

        // Buscar si ya existe un registro para este jugador y nivel
        $userLevel = $userLevelRepository->findPlayerLevelByUserAndLevel($playerId, $levelId);

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
            $userLevel = new UserLevel();
            $player = $entityManager->getRepository(Player::class)->find($playerId);
            $level = $entityManager->getRepository(Level::class)->find($levelId);

            if (!$player || !$level) {
                return $this->json([
                    'success' => false,
                    'message' => 'Jugador o nivel no encontrados'
                ], Response::HTTP_BAD_REQUEST);
            }

            $userLevel->setPlayer($player)
                    ->setLevel($level)
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
                'completado' => $userLevel->isCompletado()
            ]
        ]);
    }

    #[Route('/player/{playerId}/level/{levelId}', name: 'app_user_level_by_player_and_level', methods: ['GET'])]
    public function getPlayerLevelByUserAndLevel(
        int $playerId,
        int $levelId,
        UserLevelRepository $userLevelRepository
    ): JsonResponse {
        $userLevel = $userLevelRepository->findPlayerLevelByUserAndLevel($playerId, $levelId);

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
                'playerNombre' => $userLevel->getPlayer()->getUser()->getUsername(),
                'levelId' => $userLevel->getLevel()->getId(),
                'levelNombre' => $userLevel->getLevel()->getNombre()
            ]
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