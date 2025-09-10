<?php

namespace App\Entity;

use App\Repository\LevelEnemiesRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\Level;
use App\Entity\Enemies;

#[ORM\Entity(repositoryClass: LevelEnemiesRepository::class)]
class LevelEnemies
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Level::class, inversedBy: 'levelEnemies')]
    private ?Level $level = null;

    #[ORM\ManyToOne(targetEntity: Enemies::class, inversedBy: 'levelEnemies')]
    private ?Enemies $enemies = null;

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

    public function getEnemies(): ?Enemies
    {
        return $this->enemies;
    }

    public function setEnemies(?Enemies $enemies): static
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
