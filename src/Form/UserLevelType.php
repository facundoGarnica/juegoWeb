<?php

namespace App\Form;

use App\Entity\UserLevel;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserLevelType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('completado')
            ->add('tiempo_usado')
            ->add('puntosObtenidos')
            ->add('player')
            ->add('level')
        ;
    }


    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => UserLevel::class,
        ]);
    }
}
