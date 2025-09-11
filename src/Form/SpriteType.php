<?php

namespace App\Form;

use App\Entity\Sprite;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Validator\Constraints\File;

class SpriteType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('imagenPath', FileType::class, [
                'label' => 'sprite del objeto',
                'mapped' => false, // No se guarda automáticamente en la entidad
                'required' => false,
                'constraints' => [
                    new File([
                        'maxSize' => '5M',
                        'mimeTypes' => ['image/jpeg', 'image/png', 'image/webp'],
                        'mimeTypesMessage' => 'Subí un archivo de imagen válido (JPEG, PNG o WEBP)',
                    ])
                ],
            ])
            ->add('action')
            ->add('player')
            ->add('enemies')
            ->add('game');
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Sprite::class,
        ]);
    }
}
