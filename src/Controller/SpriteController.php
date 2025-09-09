<?php

namespace App\Controller;

use App\Entity\Sprite;
use App\Form\SpriteType;
use App\Repository\SpriteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/sprite')]
class SpriteController extends AbstractController
{
    #[Route('/', name: 'app_sprite_index', methods: ['GET'])]
    public function index(SpriteRepository $spriteRepository): Response
    {
        return $this->render('sprite/index.html.twig', [
            'sprites' => $spriteRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_sprite_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $sprite = new Sprite();
        $form = $this->createForm(SpriteType::class, $sprite);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($sprite);
            $entityManager->flush();

            return $this->redirectToRoute('app_sprite_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('sprite/new.html.twig', [
            'sprite' => $sprite,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_sprite_show', methods: ['GET'])]
    public function show(Sprite $sprite): Response
    {
        return $this->render('sprite/show.html.twig', [
            'sprite' => $sprite,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_sprite_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Sprite $sprite, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(SpriteType::class, $sprite);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_sprite_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('sprite/edit.html.twig', [
            'sprite' => $sprite,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_sprite_delete', methods: ['POST'])]
    public function delete(Request $request, Sprite $sprite, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$sprite->getId(), $request->request->get('_token'))) {
            $entityManager->remove($sprite);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_sprite_index', [], Response::HTTP_SEE_OTHER);
    }
}
