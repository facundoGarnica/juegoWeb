<?php

namespace App\Controller;

use App\Entity\LevelEnemies;
use App\Form\LevelEnemiesType;
use App\Repository\LevelEnemiesRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/level/enemies')]
class LevelEnemiesController extends AbstractController
{
    #[Route('/', name: 'app_level_enemies_index', methods: ['GET'])]
    public function index(LevelEnemiesRepository $levelEnemiesRepository): Response
    {
        return $this->render('level_enemies/index.html.twig', [
            'level_enemies' => $levelEnemiesRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_level_enemies_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $levelEnemy = new LevelEnemies();
        $form = $this->createForm(LevelEnemiesType::class, $levelEnemy);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($levelEnemy);
            $entityManager->flush();

            return $this->redirectToRoute('app_level_enemies_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('level_enemies/new.html.twig', [
            'level_enemy' => $levelEnemy,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_level_enemies_show', methods: ['GET'])]
    public function show(LevelEnemies $levelEnemy): Response
    {
        return $this->render('level_enemies/show.html.twig', [
            'level_enemy' => $levelEnemy,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_level_enemies_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, LevelEnemies $levelEnemy, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(LevelEnemiesType::class, $levelEnemy);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_level_enemies_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('level_enemies/edit.html.twig', [
            'level_enemy' => $levelEnemy,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_level_enemies_delete', methods: ['POST'])]
    public function delete(Request $request, LevelEnemies $levelEnemy, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$levelEnemy->getId(), $request->request->get('_token'))) {
            $entityManager->remove($levelEnemy);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_level_enemies_index', [], Response::HTTP_SEE_OTHER);
    }
}
