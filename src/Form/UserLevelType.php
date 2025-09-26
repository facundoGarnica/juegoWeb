<?php
namespace App\Form;

use App\Entity\UserLevel;
use App\Entity\Player;
use App\Entity\Level;
use App\Entity\Game;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserLevelSimpleType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('user', EntityType::class, [
                'class' => 'App\Entity\User',
                'choice_label' => 'username',
                'placeholder' => 'Selecciona un usuario',
                'required' => true,
                'label' => 'Usuario'
            ])
            ->add('player', EntityType::class, [
                'class' => Player::class,
                'choice_label' => 'nombre',
                'placeholder' => 'Selecciona un jugador',
                'required' => true,
                'label' => 'Jugador'
            ])
            ->add('level', EntityType::class, [
                'class' => Level::class,
                'choice_label' => 'nombre',
                'placeholder' => 'Selecciona un nivel',
                'required' => false,
                'label' => 'Nivel'
            ])
            ->add('game', EntityType::class, [
                'class' => Game::class,
                'choice_label' => 'nombre',
                'placeholder' => 'Selecciona un juego',
                'required' => false,
                'label' => 'Juego'
            ])
            ->add('completado', CheckboxType::class, [
                'required' => false,
                'label' => '¿Completado?'
            ])
            ->add('tiempo_usado', IntegerType::class, [
                'required' => false,
                'label' => 'Tiempo usado (segundos)',
                'attr' => ['min' => 0]
            ])
            ->add('puntosObtenidos', IntegerType::class, [
                'required' => false,
                'label' => 'Puntos obtenidos',
                'attr' => ['min' => 0]
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => UserLevel::class,
        ]);
    }
}