<?php

namespace App\Entity;

use App\Repository\SpriteRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\User;
use App\Entity\Enemies;

#[ORM\Entity(repositoryClass: SpriteRepository::class)]
class Sprite
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'sprites')]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: Enemies::class, inversedBy: 'sprites')]
    private ?Enemies $enemies = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $imagenPath = null;

    #[ORM\Column(length: 20)]
    private ?string $action = null;

    #[ORM\ManyToOne(inversedBy: 'sprites')]
    private ?Game $game = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
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

    public function getGame(): ?Game
    {
        return $this->game;
    }

    public function setGame(?Game $game): static
    {
        $this->game = $game;

        return $this;
    }
}
