<?php

namespace App\Entity;

use App\Repository\ScoreRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ScoreRepository::class)]
class Score
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'scores')]
    private ?user $user = null;

    #[ORM\ManyToOne(inversedBy: 'scores')]
    private ?Saves $saves = null;

    #[ORM\Column]
    private ?int $puntos = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $fecha_guardado = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?user
    {
        return $this->user;
    }

    public function setUser(?user $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getSaves(): ?Saves
    {
        return $this->saves;
    }

    public function setSaves(?Saves $saves): static
    {
        $this->saves = $saves;

        return $this;
    }

    public function getPuntos(): ?int
    {
        return $this->puntos;
    }

    public function setPuntos(int $puntos): static
    {
        $this->puntos = $puntos;

        return $this;
    }

    public function getFechaGuardado(): ?\DateTimeInterface
    {
        return $this->fecha_guardado;
    }

    public function setFechaGuardado(\DateTimeInterface $fecha_guardado): static
    {
        $this->fecha_guardado = $fecha_guardado;

        return $this;
    }
}
