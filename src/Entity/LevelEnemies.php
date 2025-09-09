<?php

namespace App\Entity;

use App\Repository\LevelEnemiesRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LevelEnemiesRepository::class)]
class LevelEnemies
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'levelEnemies')]
    private ?Level $level = null;

    #[ORM\ManyToOne(inversedBy: 'levelEnemies')]
    private ?enemies $enemies = null;

    #[ORM\Column]
    private ?int $cantidad = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLevel(): ?Level
    {
        return $this->level;
    }

    public function setLevel(?Level $level): static
    {
        $this->level = $level;

        return $this;
    }

    public function getEnemies(): ?enemies
    {
        return $this->enemies;
    }

    public function setEnemies(?enemies $enemies): static
    {
        $this->enemies = $enemies;

        return $this;
    }

    public function getCantidad(): ?int
    {
        return $this->cantidad;
    }

    public function setCantidad(int $cantidad): static
    {
        $this->cantidad = $cantidad;

        return $this;
    }
}
