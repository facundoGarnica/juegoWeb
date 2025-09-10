<?php

namespace App\Form;

use App\Entity\Sprite;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SpriteType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('imagenPath')
            ->add('action')
            ->add('user')
            ->add('enemies')
            ->add('game')
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Sprite::class,
        ]);
    }
}
