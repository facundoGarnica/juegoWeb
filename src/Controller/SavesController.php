<?php

namespace App\Controller;

use App\Entity\Saves;
use App\Form\SavesType;
use App\Repository\SavesRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/saves')]
class SavesController extends AbstractController
{
    #[Route('/', name: 'app_saves_index', methods: ['GET'])]
    public function index(SavesRepository $savesRepository): Response
    {
        return $this->render('saves/index.html.twig', [
            'saves' => $savesRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_saves_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $save = new Saves();
        $form = $this->createForm(SavesType::class, $save);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($save);
            $entityManager->flush();

            return $this->redirectToRoute('app_saves_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('saves/new.html.twig', [
            'save' => $save,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_saves_show', methods: ['GET'])]
    public function show(Saves $save): Response
    {
        return $this->render('saves/show.html.twig', [
            'save' => $save,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_saves_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Saves $save, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(SavesType::class, $save);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_saves_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('saves/edit.html.twig', [
            'save' => $save,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_saves_delete', methods: ['POST'])]
    public function delete(Request $request, Saves $save, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$save->getId(), $request->request->get('_token'))) {
            $entityManager->remove($save);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_saves_index', [], Response::HTTP_SEE_OTHER);
    }
}
