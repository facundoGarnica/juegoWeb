<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\GameRepository;
use App\Repository\EnemiesRepository; 
use Symfony\Component\HttpFoundation\JsonResponse;

class ArrayrunController extends AbstractController
{
    #[Route('/arrayrun', name: 'app_arrayrun')]
    public function index(): Response
    {
        return $this->render('ArrayRun/index.html.twig', [
            'controller_name' => 'ArrayrunController',
        ]);
    }

    #[Route('/game/{id}/enemies', name: 'game_enemies', methods: ['GET'])]
    public function enemies(int $id, GameRepository $gameRepository, EnemiesRepository $enemiesRepository): Response
    {
        $game = $gameRepository->find($id);

        if (!$game) {
            throw $this->createNotFoundException('Juego no encontrado.');
        }

        $enemies = $enemiesRepository->findBy(['game' => $game]);

        return $this->render('enemies/index.html.twig', [
            'game' => $game,
            'enemies' => $enemies,
        ]);
    }

   #[Route('/game/{id}/enemies/json', name: 'game_enemies_json', methods: ['GET'])]
public function enemiesJson(int $id, GameRepository $gameRepository, EnemiesRepository $enemiesRepository): JsonResponse
{
    $game = $gameRepository->find($id);
    if (!$game) {
        return new JsonResponse([], 404);
    }

    $enemies = $enemiesRepository->findBy(['game' => $game]);

    $data = [];
    foreach ($enemies as $enemy) {
        $spritesData = [];
        foreach ($enemy->getSprites() as $sprite) {
            $spritesData[] = [
                'imagenPath' => $sprite->getImagenPath(),
                'action' => $sprite->getAction(),
                // ⚡ Aquí usamos getEnemies() en vez de enemies_id
                'enemyName' => $sprite->getEnemies() ? $sprite->getEnemies()->getNombre() : null,
                'enemyId'   => $sprite->getEnemies() ? $sprite->getEnemies()->getId() : null,
            ];
        }

        $data[] = [
            'id' => $enemy->getId(),
            'nombre' => $enemy->getNombre(),
            'vida' => $enemy->getVida(),
            'damage' => $enemy->getDamage(),
            'sprites' => $spritesData,
        ];
    }

    return new JsonResponse($data);
}


}
