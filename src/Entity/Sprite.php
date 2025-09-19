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

    #[ORM\ManyToOne(targetEntity: Player::class, inversedBy: 'sprites')]
    private ?Player $player = null;

    #[ORM\ManyToOne(targetEntity: Enemies::class, inversedBy: 'sprites')]
    #[ORM\JoinColumn(nullable: true)]
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

    public function getPlayer(): ?Player
    {
        return $this->player;
    }

    public function setPlayer(?Player $player): static
    {
        $this->player = $player;
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
