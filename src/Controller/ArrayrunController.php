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



  #[Route('/nivelarray/{numero}', name: 'app_gamearray_nivel', requirements: ['numero' => '\d+'], methods: ['GET'])]
    public function nivel(int $numero, Environment $twig): Response
    {
        // Obtener el usuario logueado
        $user = $this->getUser();

        // Si no hay usuario, redirigir al menú principal
        if (!$user) {
            return $this->redirectToRoute('app_arrayrun');
        }

        // Ruta del template del nivel
        $templatePath = sprintf('ArrayRun/nivel-%d.html.twig', $numero);

        // Verificar que exista el template
        if (!$twig->getLoader()->exists($templatePath)) {
            return new Response('', Response::HTTP_NO_CONTENT); // 204 No Content
        }

        // Renderizar el nivel pasando el usuario
        return $this->render($templatePath, [
            'numero' => $numero,
            'user'   => $user,
            'player' => $user->getPlayers()->first() // opcional: primer personaje
        ]);
    }

   #[Route('/arrayrun', name: 'app_arrayrun')]
    public function index(GameRepository $gameRepository): Response
    {
        $game = $gameRepository->find(1); // ⚡ Nivel/menu principal
        if (!$game) {
            throw $this->createNotFoundException('Juego no encontrado.');
        }
        return $this->render('ArrayRun/index.html.twig', [
            'controller_name' => 'ArrayrunController',
            'game' => $game
        ]);
    }


}
