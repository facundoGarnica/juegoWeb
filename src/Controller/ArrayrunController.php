<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\GameRepository;
use App\Repository\UserLevelRepository;

use App\Repository\EnemiesRepository; 
use Symfony\Component\HttpFoundation\JsonResponse;
use Twig\Environment;
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

    #[Route('/game/{id}/enemies-players/json', name: 'game_enemies_players_json', methods: ['GET'])]
public function enemiesAndPlayersJson(
    int $id,
    GameRepository $gameRepository,
    EnemiesRepository $enemiesRepository,
    UserLevelRepository $userLevelRepository
): JsonResponse
{
    $game = $gameRepository->find($id);
    if (!$game) {
        return new JsonResponse(['enemies' => [], 'players' => []], 404);
    }

    // 🔹 Traer enemigos
    $enemies = $enemiesRepository->findBy(['game' => $game]);
    $enemiesData = [];

    foreach ($enemies as $enemy) {
        $spritesData = [];
        $enemySprites = $enemy->getSprites() ?? [];

        foreach ($enemySprites as $sprite) {
            $spritesData[] = [
                'imagenPath' => $sprite->getImagenPath() ?? '',
                'action' => $sprite->getAction() ?? '',
                'enemyName' => $sprite->getEnemies() ? $sprite->getEnemies()->getNombre() : null,
                'enemyId'   => $sprite->getEnemies() ? $sprite->getEnemies()->getId() : null,
            ];
        }

        $enemiesData[] = [
            'id' => $enemy->getId(),
            'nombre' => $enemy->getNombre() ?? '',
            'vida' => $enemy->getVida() ?? 0,
            'damage' => $enemy->getDamage() ?? 0,
            'sprites' => $spritesData,
        ];
    }

    // 🔹 Traer jugadores a través de UserLevel
    $userLevels = $userLevelRepository->findBy(['game' => $game]);
    $playersData = [];

    foreach ($userLevels as $userLevel) {
        $player = $userLevel->getPlayer();
        if (!$player) continue;

        $playerSprites = $player->getSprites() ?? [];

        $playersData[] = [
            'id' => $player->getId(),
            'nombre' => $player->getNombre() ?? '',
            'nivel' => $player->getNivel() ?? 1,
            'vida_actual' => $player->getVidaActual() ?? 0,
            'vida_maxima' => $player->getVidaMaxima() ?? 0,
            'experiencia' => $player->getExperiencia() ?? 0,
            'sprites' => array_map(fn($sprite) => [
                'imagenPath' => $sprite->getImagenPath() ?? '',
                'action' => $sprite->getAction() ?? '',
            ], $playerSprites->toArray()),
        ];
    }

    return new JsonResponse([
        'enemies' => $enemiesData,
        'players' => $playersData,
    ]);
}



  //metodo para seleccionar el nivel y enviarte al template
    #[Route('/nivelarray/{numero}', name: 'app_gamearray_nivel', requirements: ['numero' => '\d+'], methods: ['GET'])]
    public function nivel(int $numero, Environment $twig): Response
    {
        $templatePath = sprintf('ArrayRun/nivel-%d.html.twig', $numero);

        if (!$twig->getLoader()->exists($templatePath)) {
            return new Response('', Response::HTTP_NO_CONTENT); // 204 No Content
        }

        return $this->render($templatePath, [
            'numero' => $numero
        ]);
    }

}
