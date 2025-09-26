<?php

namespace App\Controller;

use App\Entity\Game;
use App\Form\GameType;
use App\Repository\GameRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\String\Slugger\SluggerInterface;
use App\Repository\UserLevelRepository;
use Symfony\Component\HttpFoundation\JsonResponse;


#[Route('/game')]
class GameController extends AbstractController
{
    #[Route('/', name: 'app_game_index', methods: ['GET'])]
    public function index(GameRepository $gameRepository): Response
    {
        return $this->render('game/index.html.twig', [
            'games' => $gameRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_game_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $game = new Game();
        $form = $this->createForm(GameType::class, $game);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $imageFile = $form->get('imagen_portada')->getData();

            if ($imageFile) {
                // Nombre original
                $originalFilename = $imageFile->getClientOriginalName();

                try {
                    $imageFile->move(
                        $this->getParameter('images_directory'),
                        $originalFilename
                    );
                } catch (FileException $e) {
                    // Manejar error si falla el upload
                }

                // Guardar solo el nombre en la entidad
                $game->setImagenPortada($originalFilename);
            }

            $entityManager->persist($game);
            $entityManager->flush();

            return $this->redirectToRoute('app_game_index');
        }

        return $this->renderForm('game/new.html.twig', [
            'game' => $game,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_game_show', methods: ['GET'])]
    public function show(Game $game): Response
    {
        return $this->render('game/show.html.twig', [
            'game' => $game,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_game_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Game $game, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(GameType::class, $game);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $imageFile = $form->get('imagen_portada')->getData();

            if ($imageFile) {
                // Borrar la imagen anterior si existe
                $oldImage = $game->getImagenPortada();
                if ($oldImage) {
                    $oldImagePath = $this->getParameter('images_directory') . '/' . $oldImage;
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }

                // Guardar nueva imagen
                $originalFilename = $imageFile->getClientOriginalName();

                try {
                    $imageFile->move(
                        $this->getParameter('images_directory'),
                        $originalFilename
                    );
                } catch (FileException $e) {
                    // Manejar error de upload
                }

                $game->setImagenPortada($originalFilename);
            }

            $entityManager->flush();

            return $this->redirectToRoute('app_game_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('game/edit.html.twig', [
            'game' => $game,
            'form' => $form,
        ]);
    }


    #[Route('/{id}', name: 'app_game_delete', methods: ['POST'])]
    public function delete(Request $request, Game $game, EntityManagerInterface $entityManager): Response
        {
            if ($this->isCsrfTokenValid('delete'.$game->getId(), $request->request->get('_token'))) {

                // 🔹 Borrar imagen física si existe
                $imageName = $game->getImagenPortada();
                if ($imageName) {
                    $imagePath = $this->getParameter('images_directory') . '/' . $imageName;
                    if (file_exists($imagePath)) {
                        unlink($imagePath); // elimina el archivo
                    }
                }

                // 🔹 Borrar la entidad
                $entityManager->remove($game);
                $entityManager->flush();
            }

            return $this->redirectToRoute('app_game_index', [], Response::HTTP_SEE_OTHER);
        }

    #[Route('/{id}/top-scores', name: 'app_game_top_scores', methods: ['GET'])]
    public function topScoresByGame(
        int $id,
        GameRepository $gameRepository,
        UserLevelRepository $userLevelRepository
    ): JsonResponse
    {
        $game = $gameRepository->find($id);
        if (!$game) {
            throw $this->createNotFoundException('Juego no encontrado.');
        }

        // 🔹 Usar el método optimizado que hace JOIN directo con User
        $topScores = $userLevelRepository->findTopScoresByGameWithUsers($game, 4);

        $data = [];
        foreach ($topScores as $ul) {
            $data[] = [
                'player' => $ul->getPlayer() ? $ul->getPlayer()->getNombre() : 'N/A',
                'user'   => $ul->getUser() ? $ul->getUser()->getUsername() : 'N/A', // 🔹 Ahora obtiene el usuario correcto
                'nivel'  => $ul->getLevel() ? $ul->getLevel()->getNombre() : 'N/A',
                'puntos' => $ul->getPuntosObtenidos(),
            ];
        }

        return new JsonResponse($data);
    }

}
