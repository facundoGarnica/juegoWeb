<?php

namespace App\Controller;

use App\Entity\UserLevel;
use App\Form\UserLevelType;
use App\Repository\UserLevelRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

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
        $form = $this->createForm(UserLevelType::class, $userLevel);
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
        $form = $this->createForm(UserLevelType::class, $userLevel);
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
