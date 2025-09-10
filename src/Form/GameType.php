<?php

namespace App\Form;

use App\Entity\Game;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Validator\Constraints\File;

class GameType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
        ->add('nombre')
        ->add('descripcion')
        ->add('version')
        ->add('activo')
        ->add('imagen_portada', FileType::class, [
            'label' => 'Imagen de portada',
            'mapped' => false, // importante: no se mapea automáticamente
            'required' => false,
            'constraints' => [
                new File([
                    'maxSize' => '5M',
                    'mimeTypes' => ['image/jpeg','image/png','image/webp'],
                    'mimeTypesMessage' => 'Subí un archivo de imagen válido',
                ])
            ],
        ])
        ->add('fecha_creacion');
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Game::class,
        ]);
    }
}
