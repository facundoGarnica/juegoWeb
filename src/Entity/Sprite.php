<?php

namespace App\Entity;

use App\Repository\SpriteRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SpriteRepository::class)]
class Sprite
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'sprites')]
    private ?user $user = null;

    #[ORM\ManyToOne(inversedBy: 'sprites')]
    private ?Enemies $enemies = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $imagenPath = null;

    #[ORM\Column(length: 20)]
    private ?string $action = null;

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

    public function getEnemies(): ?Enemies
    {
        return $this->enemies;
    }

    public function setEnemies(?Enemies $enemies): static
    {
        $this->enemies = $enemies;

        return $this;
    }

    public function getImagenPath(): ?string
    {
        return $this->imagenPath;
    }

    public function setImagenPath(?string $imagenPath): static
    {
        $this->imagenPath = $imagenPath;

        return $this;
    }

    public function getAction(): ?string
    {
        return $this->action;
    }

    public function setAction(string $action): static
    {
        $this->action = $action;

        return $this;
    }
}
