<?php

namespace App\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

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
use App\Repository\PlayerRepository;
use App\Repository\EnemiesRepository;
use App\Repository\UserRepository;
use Twig\Environment;

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
            $this->addFlash('error', 'Usuario o contraseña incorrecta');
        }

        return $this->render('home/index.html.twig', [
            'last_username' => $lastUsername,
            'error' => $error,
            'registrationForm' => $registrationForm->createView(),
            'games' => $games,
        ]);
    }



#[Route('/juego/{id}/{userId?}', name: 'juego_players', methods: ['GET'])]
public function juegoPlayers(
    int $id,
    ?int $userId,
    GameRepository $gameRepository,
    PlayerRepository $playerRepository,
    Environment $twig,
    UserRepository $userRepository
): Response {
    // 1️⃣ Buscar el juego
    $game = $gameRepository->find($id);
    if (!$game) {
        return new Response('Juego no encontrado', 404);
    }

    // 2️⃣ Obtener el usuario
    $user = $userId ? $userRepository->find($userId) : $this->getUser();
    if (!$user) {
        return new Response('Usuario no encontrado', 404);
    }

    // 3️⃣ Obtener todos los players del juego
    $players = $playerRepository->findBy(['game' => $game]);

    // 4️⃣ Construir el nombre del template dinámico (según el nombre del juego)
    $templateName = $game->getNombre() . '/index.html.twig';
    if (!$twig->getLoader()->exists($templateName)) {
        return new Response('Template no encontrado', 404);
    }

    // 5️⃣ Renderizar el template con todas las variables necesarias
    return $this->render($templateName, [
        'id'      => $id,
        'game'    => $game,
        'user'    => $user,
        'players' => $players
    ]);
}






 #[Route('/formularios', name: 'app_formularios')]
    public function formularios(): Response
    {
        return $this->render('menuFormularios.html.twig');
    }

}