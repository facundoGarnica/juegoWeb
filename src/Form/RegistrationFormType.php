<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\IsTrue;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;

class RegistrationFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
            $builder
        ->add('username')
        ->add('agreeTerms', CheckboxType::class, [
            'mapped' => false,
            'constraints' => [
                new IsTrue([
                    'message' => 'Debes aceptar los términos.',
                ]),
            ],
        ])
        ->add('plainPassword', RepeatedType::class, [
            'type' => PasswordType::class,
            'mapped' => false,
            'first_options' => [
                'label' => 'Contraseña',
                'attr' => ['autocomplete' => 'new-password'],
            ],
            'second_options' => [
                'label' => 'Repetir Contraseña',
                'attr' => ['autocomplete' => 'new-password'],
            ],
            'invalid_message' => 'Las contraseñas deben coincidir',
            'constraints' => [
                new NotBlank([
                    'message' => 'Ingresa una contraseña',
                ]),
                new Length([
                    'min' => 4,
                    'minMessage' => 'La contraseña debe tener al menos {{ limit }} caracteres',
                    'max' => 4096,
                ]),
            ],
        ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
