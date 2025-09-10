<?php

namespace App\Entity;

use App\Repository\LevelRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LevelRepository::class)]
class Level
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $nombre = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $descripcion = null;

    #[ORM\Column]
    private ?float $dificultad = null;

    #[ORM\OneToMany(targetEntity: UserLevel::class, mappedBy: 'level')]
    private Collection $userLevels;

    #[ORM\OneToMany(targetEntity: LevelEnemies::class, mappedBy: 'level')]
    private Collection $levelEnemies;

    #[ORM\ManyToOne(inversedBy: 'levels')]
    private ?Game $game = null;

    public function __construct()
    {
        $this->userLevels = new ArrayCollection();
        $this->levelEnemies = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombre(): ?string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): static
    {
        $this->nombre = $nombre;

        return $this;
    }

    public function getDescripcion(): ?string
    {
        return $this->descripcion;
    }

    public function setDescripcion(?string $descripcion): static
    {
        $this->descripcion = $descripcion;

        return $this;
    }

    public function getDificultad(): ?float
    {
        return $this->dificultad;
    }

    public function setDificultad(float $dificultad): static
    {
        $this->dificultad = $dificultad;

        return $this;
    }

    /**
     * @return Collection<int, UserLevel>
     */
    public function getUserLevels(): Collection
    {
        return $this->userLevels;
    }

    public function addUserLevel(UserLevel $userLevel): static
    {
        if (!$this->userLevels->contains($userLevel)) {
            $this->userLevels->add($userLevel);
            $userLevel->setLevel($this);
        }

        return $this;
    }

    public function removeUserLevel(UserLevel $userLevel): static
    {
        if ($this->userLevels->removeElement($userLevel)) {
            // set the owning side to null (unless already changed)
            if ($userLevel->getLevel() === $this) {
                $userLevel->setLevel(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, LevelEnemies>
     */
    public function getLevelEnemies(): Collection
    {
        return $this->levelEnemies;
    }

    public function addLevelEnemy(LevelEnemies $levelEnemy): static
    {
        if (!$this->levelEnemies->contains($levelEnemy)) {
            $this->levelEnemies->add($levelEnemy);
            $levelEnemy->setLevel($this);
        }

        return $this;
    }

    public function removeLevelEnemy(LevelEnemies $levelEnemy): static
    {
        if ($this->levelEnemies->removeElement($levelEnemy)) {
            // set the owning side to null (unless already changed)
            if ($levelEnemy->getLevel() === $this) {
                $levelEnemy->setLevel(null);
            }
        }

        return $this;
    }
    public function __toString(): string
    {
        return (string) $this->nombre;
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
