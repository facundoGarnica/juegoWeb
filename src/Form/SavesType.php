<?php

namespace App\Form;

use App\Entity\Saves;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SavesType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('pos_x')
            ->add('pos_y')
            ->add('vidasRestantes')
            ->add('fecha_guardado')
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Saves::class,
        ]);
    }
}
