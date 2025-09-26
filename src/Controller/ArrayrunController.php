<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\GameRepository;
use App\Repository\UserLevelRepository;
use App\Repository\PlayerRepository;
use App\Repository\UserRepository;
use App\Repository\EnemiesRepository; 
use App\Repository\LevelRepository; 
use Symfony\Component\HttpFoundation\JsonResponse;
use Twig\Environment;
use Doctrine\ORM\EntityManagerInterface;

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



  #[Route('/nivelarray/{numero}/{playerId?}/{gameId?}', name: 'app_gamearray_nivel', requirements: ['numero' => '\d+'], methods: ['GET'])]
public function nivel(
    int $numero,
    ?int $playerId,
    PlayerRepository $playerRepository,
    GameRepository $gameRepository,
    LevelRepository $levelRepository,
    ?int $gameId,
    Environment $twig
): Response
{
    $user = $this->getUser();
    if (!$user) {
        return $this->redirectToRoute('app_arrayrun');
    }

    // 🔹 Obtener el player
    if ($playerId) {
        $player = $playerRepository->find($playerId);
        if (!$player || !$player->getUserPlayers()->exists(fn($k,$up) => $up->getPlayer() === $player && $up->getUser() === $user)) {
            return new Response('Player no encontrado o no pertenece al usuario', 404);
        }
    } else {
        $player = $user->getUserPlayers()->first()?->getPlayer();
        if (!$player) {
            return new Response('No hay players asignados al usuario', 404);
        }
    }

    // 🔹 Obtener el juego
    if ($gameId) {
        $game = $gameRepository->find($gameId);
        if (!$game) {
            return new Response('Juego no encontrado', 404);
        }
    } else {
        // Por defecto, juego ID = 1
        $game = $gameRepository->find(1);
        if (!$game) {
            return new Response('Juego no encontrado', 404);
        }
    }

    // 🔹 Obtener el nivel
    $level = $levelRepository->findOneBy([
        'lvlNumber' => $numero,
        'game' => $game
    ]);
    $levelId = $level ? $level->getId() : null;

    // 🔹 Verificar que exista el template
    $templatePath = sprintf('ArrayRun/nivel-%d.html.twig', $numero);
    if (!$twig->getLoader()->exists($templatePath)) {
        return new Response('', Response::HTTP_NO_CONTENT);
    }

    // 🔹 Renderizar
    return $this->render($templatePath, [
        'numero'  => $numero,
        'user'    => $user,
        'player'  => $player,
        'gameId'  => $game->getId(),
        'levelId' => $levelId
    ]);
}



  #[Route('/arrayrun/{userId?}', name: 'app_arrayrun')]
public function index(
    GameRepository $gameRepository,
    PlayerRepository $playerRepository,
    UserRepository $userRepository
): Response {
    // 1️⃣ Buscar el juego del menú
    $game = $gameRepository->find(1); // ⚡ Nivel/menu principal
    if (!$game) {
        throw $this->createNotFoundException('Juego no encontrado.');
    }

    // 2️⃣ Obtener el usuario actual (o por parámetro)
    $user = $userId ?? $this->getUser();
    if (!$user) {
        return new Response('Usuario no encontrado', 404);
    }

    // 3️⃣ Obtener todos los players del juego
    $players = $playerRepository->findBy(['game' => $game]);

    // 4️⃣ Renderizar el template con todas las variables necesarias
    return $this->render('ArrayRun/index.html.twig', [
        'game'    => $game,
        'user'    => $user,
        'players' => $players
    ]);
}

#[Route('/assign-players/{userId}/{gameId}', name: 'app_assign_all_players', methods: ['POST'])]
public function assignAllPlayersToUserController(
    int $userId,
    int $gameId,
    GameRepository $gameRepository,
    PlayerRepository $playerRepository,
    \App\Repository\UserRepository $userRepository,
    EntityManagerInterface $em
): JsonResponse
{
    $user = $userRepository->find($userId);
    if (!$user) {
        return $this->json(['success' => false, 'message' => 'Usuario no encontrado'], 404);
    }

    $game = $gameRepository->find($gameId);
    if (!$game) {
        return $this->json(['success' => false, 'message' => 'Juego no encontrado'], 404);
    }

    $players = $playerRepository->findBy(['game' => $game]);
    $assignedCount = 0;

    foreach ($players as $player) {
        $exists = $user->getUserPlayers()->exists(fn($k, $up) => $up->getPlayer() === $player);
        if (!$exists) {
            $userPlayer = new \App\Entity\UserPlayer();
            $userPlayer->setUser($user);
            $userPlayer->setPlayer($player);

            $em->persist($userPlayer);
            $user->addUserPlayer($userPlayer);
            $assignedCount++;
        }
    }

    $em->flush();

    return $this->json([
        'success' => true,
        'message' => "$assignedCount players asignados al usuario",
        'totalAssigned' => $assignedCount
    ]);
}


}
