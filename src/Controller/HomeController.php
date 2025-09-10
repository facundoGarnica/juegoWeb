<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use App\Form\RegistrationFormType;
use App\Entity\User;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\UserLevelRepository;
use App\Repository\GameRepository;

class HomeController extends AbstractController
{
  #[Route('/home', name: 'app_home', methods: ['GET', 'POST'])]
    public function index(
        AuthenticationUtils $authenticationUtils,
        FormFactoryInterface $formFactory,
        Request $request,
        GameRepository $gameRepository
    ): Response
    {
        // Trae todos los juegos
        $games = $gameRepository->findAll();
        
        // Variables para login
        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();

        // Formulario de registro
        $user = new User();
        $registrationForm = $formFactory->create(RegistrationFormType::class, $user);
        $registrationForm->handleRequest($request);

        // Si se envió el formulario de registro
        if ($registrationForm->isSubmitted() && $registrationForm->isValid()) {
            $this->addFlash('success', 'Usuario registrado correctamente.');
            return $this->redirectToRoute('app_home');
        }

        // Flash si hubo error en login
        if ($error) {
            $this->addFlash('error', 'Credenciales incorrectas: ' . $error->getMessage());
        }

        return $this->render('home/index.html.twig', [
            'last_username' => $lastUsername,
            'error' => $error,
            'registrationForm' => $registrationForm->createView(),
            'games' => $games,
        ]);
    }

    #[Route('/formularios', name: 'app_formularios')]
    public function formularios(): Response
    {
        return $this->render('menuFormularios.html.twig');
    }

    // Ruta para el juego específico
   #[Route('/juego/{id}/{userId}', name: 'juego_pad')]
    public function juegoPad(int $id, ?int $userId, GameRepository $gameRepository): Response
    {
        $game = $gameRepository->find($id);

        if (!$game) {
            // Juego no encontrado, devolver respuesta vacía
            return new Response('', 204); // 204 = No Content
        }

        $gameName = $game->getNombre();

        // Si userId no se pasa, tomar del usuario logueado
        if (!$userId) {
            $user = $this->getUser();
            $userId = $user ? $user->getId() : null;
        }

        // Verificar si el template existe
        $templatePath = $this->getParameter('kernel.project_dir') . "/templates/juegos/$gameName.html.twig";
        if (!file_exists($templatePath)) {
            // No hacer nada, devolver respuesta vacía
            return new Response('', 204);
        }

        return $this->render("juegos/$gameName.html.twig", [
            'id' => $id,
            'userId' => $userId,
            'nombre' => $gameName,
        ]);
    }


}