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
use App\Repository\PlayerRepository;
use App\Repository\EnemiesRepository;
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

    //ruta para el juego seleccionado, aca entra al juego elegido, verifica si el usuario esta logueado y 
    // trae todos los personajes con sus sprites
    #[Route('/juego/{id}/{userId}', name: 'juego_pad')]
    public function juegoPad(
        int $id,
        ?int $userId,
        GameRepository $gameRepository,
        PlayerRepository $playerRepository,
        EnemiesRepository $enemiesRepository,
        Environment $twig
    ): Response {
        $game = $gameRepository->find($id);

        if (!$game) {
            return new Response('', 204); // Juego no encontrado
        }

        $gameName = $game->getNombre();

        // Si no se pasa userId, tomar del usuario logueado
        if (!$userId) {
            $user = $this->getUser();
            $userId = $user ? $user->getId() : null;
        }

        // 🔹 Buscar Players + Sprites
       // $players = $playerRepository->findPlayersWithSpritesByGame($id);

        // 🔹 Buscar Enemies + Sprites
      //  $enemies = $enemiesRepository->findEnemiesWithSpritesByGame($id);

        // 🔹 Buscar template en /templates/{GameName}/index.html.twig
        $templateName = $gameName . '/index.html.twig';

        if (!$twig->getLoader()->exists($templateName)) {
            return new Response('', 204); // No existe
        }

        return $this->render($templateName, [
            'id'      => $id,
            'game'    => $game,
            'userId'  => $userId,
         //   'players' => $players,
         //   'enemies' => $enemies,
        ]);
    }




}