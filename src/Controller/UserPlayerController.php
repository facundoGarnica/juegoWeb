<?php

namespace App\Controller;

use App\Entity\UserPlayer;
use App\Form\UserPlayerType;
use App\Repository\UserPlayerRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\GameRepository;
use App\Repository\PlayerRepository;

#[Route('/user/player')]
class UserPlayerController extends AbstractController
{
    #[Route('/', name: 'app_user_player_index', methods: ['GET'])]
    public function index(UserPlayerRepository $userPlayerRepository): Response
    {
        return $this->render('user_player/index.html.twig', [
            'user_players' => $userPlayerRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_user_player_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $userPlayer = new UserPlayer();
        $form = $this->createForm(UserPlayerType::class, $userPlayer);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($userPlayer);
            $entityManager->flush();

            return $this->redirectToRoute('app_user_player_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('user_player/new.html.twig', [
            'user_player' => $userPlayer,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_user_player_show', methods: ['GET'])]
    public function show(UserPlayer $userPlayer): Response
    {
        return $this->render('user_player/show.html.twig', [
            'user_player' => $userPlayer,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_user_player_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, UserPlayer $userPlayer, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(UserPlayerType::class, $userPlayer);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_user_player_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('user_player/edit.html.twig', [
            'user_player' => $userPlayer,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_user_player_delete', methods: ['POST'])]
    public function delete(Request $request, UserPlayer $userPlayer, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$userPlayer->getId(), $request->request->get('_token'))) {
            $entityManager->remove($userPlayer);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_user_player_index', [], Response::HTTP_SEE_OTHER);
    }

        #[Route('/game/{gameId}/players', name: 'app_game_players', methods: ['GET'])]
    public function gamePlayers(
        int $gameId,
        GameRepository $gameRepository,
        PlayerRepository $playerRepository
    ): Response
    {
        // 1️⃣ Buscar el juego
        $game = $gameRepository->find($gameId);
        if (!$game) {
            return $this->json(['error' => 'Juego no encontrado'], 404);
        }

        // 2️⃣ Traer todos los players asociados a ese juego
        $players = $playerRepository->findBy([
            'game' => $game
        ]);

        // 3️⃣ Convertir a array simple para JSON
       $data = array_map(fn($player) => [
            'id' => $player->getId(),
            'nombre' => $player->getNombre(),
            'vida_actual' => $player->getVidaActual(),
            'vida_maxima' => $player->getVidaMaxima(),
            'speed' => $player->getSpeed(),
            'jumpSpeed' => $player->getJumpSpeed(),
            'name_sprite' => $player->getNameSprite(),
        ], $players);


        // 4️⃣ Devolver JSON
        return $this->json([
            'game' => [
                'id' => $game->getId(),
                'nombre' => $game->getNombre()
            ],
            'players' => $data
        ]);
    }


}
