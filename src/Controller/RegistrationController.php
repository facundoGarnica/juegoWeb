<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegistrationFormType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class RegistrationController extends AbstractController
{
    #[Route('/register', name: 'app_register', methods: ['GET', 'POST'])]
    public function register(Request $request, UserPasswordHasherInterface $userPasswordHasher, EntityManagerInterface $entityManager): Response
    {
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        $isAjax = $request->isXmlHttpRequest();

        if ($form->isSubmitted()) {
            if ($form->isValid()) {
                try {
                    $user->setPassword(
                        $userPasswordHasher->hashPassword(
                            $user,
                            $form->get('plainPassword')->getData()
                        )
                    );

                    $entityManager->persist($user);
                    $entityManager->flush();

                    if ($isAjax) {
                        return new JsonResponse([
                            'success' => true,
                            'message' => 'Registro exitoso'
                        ]);
                    }

                    return $this->redirectToRoute('app_home');
                } catch (\Exception $e) {
                    if ($isAjax) {
                        return new JsonResponse([
                            'success' => false,
                            'errors' => ['general' => ['Error al guardar el usuario: ' . $e->getMessage()]]
                        ], 500);
                    }
                    $this->addFlash('error', 'Error al registrar usuario');
                }
            } else {
                if ($isAjax) {
                    $errors = [];

                    // Errores por campo
                    foreach ($form as $field) {
                        $fieldErrors = [];
                        foreach ($field->getErrors(true) as $error) {
                            $fieldErrors[] = $error->getMessage();
                        }
                        if ($fieldErrors) {
                            $errors[$field->getName()] = $fieldErrors;
                        }
                    }

                    // Errores generales (sin duplicar los de los campos)
                    foreach ($form->getErrors(true) as $error) {
                        $origin = $error->getOrigin();
                        if ($origin && $origin->getName() !== $form->getName()) {
                            continue; // este error pertenece a un campo
                        }

                        if (!isset($errors['general'])) {
                            $errors['general'] = [];
                        }
                        $errors['general'][] = $error->getMessage();
                    }

                    return new JsonResponse([
                        'success' => false,
                        'errors' => $errors
                    ], 400);
                }
            }
        }

        if (!$isAjax) {
            return $this->render('registration/register.html.twig', [
                'registrationForm' => $form->createView(),
            ]);
        }

        return new JsonResponse([
            'success' => false,
            'errors' => ['general' => ['Petición inválida']]
        ], 400);
    }
}
