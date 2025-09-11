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
use Symfony\Component\HttpFoundation\File\Exception\FileException;

#[Route('/sprite')]
class SpriteController extends AbstractController
{
    private string $spriteDir = 'C:\xampp\htdocs\juegoweb\public\images\sprites';

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
            $imageFile = $form->get('imagenPath')->getData();

            if ($imageFile) {
                $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                $newFilename = uniqid().'-'.$originalFilename.'.'.$imageFile->guessExtension();

                try {
                    $imageFile->move($this->spriteDir, $newFilename);
                } catch (FileException $e) {
                    $this->addFlash('error', 'Error al subir la imagen.');
                }

                $sprite->setImagenPath($newFilename);
            }

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
            $imageFile = $form->get('imagenPath')->getData();

            if ($imageFile) {
                // borrar imagen anterior si existe
                $oldImage = $sprite->getImagenPath();
                if ($oldImage) {
                    $oldImagePath = $this->spriteDir . DIRECTORY_SEPARATOR . $oldImage;
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }

                // guardar nueva imagen
                $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                $newFilename = uniqid().'-'.$originalFilename.'.'.$imageFile->guessExtension();

                try {
                    $imageFile->move($this->spriteDir, $newFilename);
                } catch (FileException $e) {
                    $this->addFlash('error', 'Error al subir la nueva imagen.');
                }

                $sprite->setImagenPath($newFilename);
            }

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
            // borrar imagen física
            $imageName = $sprite->getImagenPath();
            if ($imageName) {
                $imagePath = $this->spriteDir . DIRECTORY_SEPARATOR . $imageName;
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }

            $entityManager->remove($sprite);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_sprite_index', [], Response::HTTP_SEE_OTHER);
    }
}
