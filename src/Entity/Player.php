<?php

namespace App\Entity;

use App\Repository\PlayerRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: PlayerRepository::class)]
class Player
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $nombre = null;

    #[ORM\Column]
    private ?int $nivel = null;

    #[ORM\Column]
    private ?float $experiencia = null;

    #[ORM\Column]
    private ?int $vida_actual = null;

    #[ORM\Column]
    private ?int $vida_maxima = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $fecha_creacion = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $ultima_conexion = null;

    #[ORM\ManyToOne(inversedBy: 'players')]
    private ?User $user = null;

    

    // 🔹 Corregido: usar la columna games_id de la DB
    #[ORM\ManyToOne(inversedBy: 'players')]
    #[ORM\JoinColumn(name: 'games_id', referencedColumnName: 'id')]
    private ?Game $game = null;

    #[ORM\OneToMany(mappedBy: 'player', targetEntity: Sprite::class, cascade: ['persist', 'remove'])]
    private Collection $sprites;

    #[ORM\OneToMany(mappedBy: 'player', targetEntity: UserLevel::class, cascade: ['persist', 'remove'])]
    private Collection $userLevels;
    
    public function __construct()
    {
        $this->sprites = new ArrayCollection();
        $this->userLevels = new ArrayCollection();
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

    public function getNivel(): ?int
    {
        return $this->nivel;
    }

    public function setNivel(int $nivel): static
    {
        $this->nivel = $nivel;
        return $this;
    }

    public function getExperiencia(): ?float
    {
        return $this->experiencia;
    }

    public function setExperiencia(float $experiencia): static
    {
        $this->experiencia = $experiencia;
        return $this;
    }

    public function getVidaActual(): ?int
    {
        return $this->vida_actual;
    }

    public function setVidaActual(int $vida_actual): static
    {
        $this->vida_actual = $vida_actual;
        return $this;
    }

    public function getVidaMaxima(): ?int
    {
        return $this->vida_maxima;
    }

    public function setVidaMaxima(int $vida_maxima): static
    {
        $this->vida_maxima = $vida_maxima;
        return $this;
    }

    public function getFechaCreacion(): ?\DateTimeInterface
    {
        return $this->fecha_creacion;
    }

    public function setFechaCreacion(\DateTimeInterface $fecha_creacion): static
    {
        $this->fecha_creacion = $fecha_creacion;
        return $this;
    }

    public function getUltimaConexion(): ?\DateTimeInterface
    {
        return $this->ultima_conexion;
    }

    public function setUltimaConexion(\DateTimeInterface $ultima_conexion): static
    {
        $this->ultima_conexion = $ultima_conexion;
        return $this;
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

    public function getGame(): ?Game
    {
        return $this->game;
    }

    public function setGame(?Game $game): static
    {
        $this->game = $game;
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
            $sprite->setPlayer($this);
        }

        return $this;
    }

    public function removeSprite(Sprite $sprite): static
    {
        if ($this->sprites->removeElement($sprite)) {
            if ($sprite->getPlayer() === $this) {
                $sprite->setPlayer(null);
            }
        }

        return $this;
    }

    public function __toString(): string
    {
        return (string) $this->nombre;
    }
}
