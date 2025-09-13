<?php

namespace App\Controller;

use App\Entity\Level;
use App\Form\LevelType;
use App\Repository\LevelRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Repository\GameRepository;


#[Route('/level')]
class LevelController extends AbstractController
{
    // Mostrar todos los niveles
    #[Route('/', name: 'app_level_index', methods: ['GET'])]
    public function index(LevelRepository $levelRepository): Response
    {
        return $this->render('level/index.html.twig', [
            'levels' => $levelRepository->findAll(),
        ]);
    }

    // Crear un nuevo nivel
    #[Route('/new', name: 'app_level_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $level = new Level();
        $form = $this->createForm(LevelType::class, $level);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($level);
            $entityManager->flush();

            return $this->redirectToRoute('app_level_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('level/new.html.twig', [
            'level' => $level,
            'form' => $form,
        ]);
    }

    // Mostrar un nivel específico
    #[Route('/{id}', name: 'app_level_show', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function show(Level $level): Response
    {
        return $this->render('level/show.html.twig', [
            'level' => $level,
        ]);
    }

    // Editar un nivel
    #[Route('/{id}/edit', name: 'app_level_edit', methods: ['GET', 'POST'], requirements: ['id' => '\d+'])]
    public function edit(Request $request, Level $level, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(LevelType::class, $level);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_level_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('level/edit.html.twig', [
            'level' => $level,
            'form' => $form,
        ]);
    }

    // Eliminar un nivel (POST)
    #[Route('/{id}/delete', name: 'app_level_delete', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function delete(Request $request, Level $level, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$level->getId(), $request->request->get('_token'))) {
            $entityManager->remove($level);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_level_index', [], Response::HTTP_SEE_OTHER);
    }

     #[Route('/api/levels/{gameId}', name: 'api_levels_by_game', methods: ['GET'], requirements: ['gameId' => '\d+'])]
    public function allLevelsByGame(
        int $gameId,
        GameRepository $gameRepository,
        LevelRepository $levelRepository
    ): JsonResponse {
        error_log("API: Buscando niveles para juego ID: " . $gameId);
        
        // Buscar el juego
        $game = $gameRepository->find($gameId);

        if (!$game) {
            error_log("API: Juego con ID $gameId no encontrado");
            return new JsonResponse([
                'success' => false,
                'message' => "Juego con ID $gameId no encontrado"
            ], 404);
        }

        // Buscar todos los niveles del juego, ordenados por lvlNumber
        $levels = $levelRepository->findBy(
            ['game' => $game], 
            ['lvlNumber' => 'ASC'] // Ordenar por número de nivel
        );
        error_log("API: Niveles encontrados: " . count($levels));

        // Preparar JSON
        $data = [];
        foreach ($levels as $level) {
            $data[] = [
                'id' => $level->getId(),
                'nombre' => $level->getNombre(),
                'descripcion' => $level->getDescripcion(),
                'dificultad' => $level->getDificultad(),
                'lvlNumber' => $level->getLvlNumber(), // ← Campo agregado
            ];
        }

        return new JsonResponse([
            'success' => true,
            'gameId' => $gameId,
            'levels' => $data
        ]);
    }
}
