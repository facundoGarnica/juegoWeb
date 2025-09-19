<?php

namespace App\Entity;

use App\Repository\EnemiesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EnemiesRepository::class)]
class Enemies
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 15)]
    private ?string $nombre = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $descripcion = null;

    #[ORM\Column]
    private ?int $vida = null;

    #[ORM\Column]
    private ?int $damage = null;

    #[ORM\OneToMany(targetEntity: LevelEnemies::class, mappedBy: 'enemies')]
    private Collection $levelEnemies;

    #[ORM\OneToMany(mappedBy: 'enemies', targetEntity: Sprite::class, cascade: ['persist', 'remove'])]
    private Collection $sprites;

    #[ORM\ManyToOne(inversedBy: 'enemies')]
    private ?Game $game = null;

    public function __construct()
    {
        $this->levelEnemies = new ArrayCollection();
        $this->sprites = new ArrayCollection();
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

    public function getVida(): ?int
    {
        return $this->vida;
    }

    public function setVida(int $vida): static
    {
        $this->vida = $vida;
        return $this;
    }

    public function getDamage(): ?int
    {
        return $this->damage;
    }

    public function setDamage(int $damage): static
    {
        $this->damage = $damage;
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
            $levelEnemy->setEnemies($this);
        }

        return $this;
    }

    public function removeLevelEnemy(LevelEnemies $levelEnemy): static
    {
        if ($this->levelEnemies->removeElement($levelEnemy)) {
            if ($levelEnemy->getEnemies() === $this) {
                $levelEnemy->setEnemies(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Sprite>
     */
    public function getSprites(): Collection
    {
        return $this->sprites;
    }

    public function addSprite(Sprite $sprite): static
    {
        if (!$this->sprites->contains($sprite)) {
            $this->sprites->add($sprite);
            $sprite->setEnemies($this);
        }

        return $this;
    }

    public function removeSprite(Sprite $sprite): static
    {
        if ($this->sprites->removeElement($sprite)) {
            if ($sprite->getEnemies() === $this) {
                $sprite->setEnemies(null);
            }
        }

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

    public function __toString(): string
    {
        return (string) $this->nombre;
    }
}
