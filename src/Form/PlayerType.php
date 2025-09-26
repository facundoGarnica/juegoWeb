<?php

namespace App\Form;

use App\Entity\Player;
use App\Entity\User;
use App\Entity\Game;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\NumberType; // <- para speed y jumpSpeed

class PlayerType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('nombre')
            ->add('nivel')
            ->add('experiencia')
            ->add('vida_actual')
            ->add('vida_maxima')
            ->add('speed', NumberType::class, [
                'required' => false,
                'scale' => 2, // permite decimales si quieres
            ])
            ->add('jumpSpeed', NumberType::class, [
                'required' => false,
                'scale' => 2,
            ])
            ->add('name_sprite')
            ->add('fecha_creacion', DateTimeType::class, [
                'widget' => 'single_text',
            ])
            ->add('ultima_conexion', DateTimeType::class, [
                'widget' => 'single_text',
            ])
            ->add('game', EntityType::class, [
                'class' => Game::class,
                'choice_label' => 'nombre',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Player::class,
        ]);
    }
}
