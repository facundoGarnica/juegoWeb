<?php

namespace App\Controller;

use App\Entity\Enemies;
use App\Form\EnemiesType;
use App\Repository\EnemiesRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/enemies')]
class EnemiesController extends AbstractController
{
    #[Route('/', name: 'app_enemies_index', methods: ['GET'])]
    public function index(EnemiesRepository $enemiesRepository): Response
    {
        return $this->render('enemies/index.html.twig', [
            'enemies' => $enemiesRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_enemies_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $enemy = new Enemies();
        $form = $this->createForm(EnemiesType::class, $enemy);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($enemy);
            $entityManager->flush();

            return $this->redirectToRoute('app_enemies_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('enemies/new.html.twig', [
            'enemy' => $enemy,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_enemies_show', methods: ['GET'])]
    public function show(Enemies $enemy): Response
    {
        return $this->render('enemies/show.html.twig', [
            'enemy' => $enemy,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_enemies_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Enemies $enemy, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(EnemiesType::class, $enemy);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_enemies_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('enemies/edit.html.twig', [
            'enemy' => $enemy,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_enemies_delete', methods: ['POST'])]
    public function delete(Request $request, Enemies $enemy, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$enemy->getId(), $request->request->get('_token'))) {
            $entityManager->remove($enemy);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_enemies_index', [], Response::HTTP_SEE_OTHER);
    }
}
