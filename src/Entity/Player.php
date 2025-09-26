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

    #[ORM\Column(nullable: true)]
    private ?float $speed = null;

    #[ORM\Column(nullable: true)]
    private ?float $jumpSpeed = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $fecha_creacion = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $ultima_conexion = null;

    #[ORM\ManyToOne(inversedBy: 'players')]
    #[ORM\JoinColumn(name: 'games_id', referencedColumnName: 'id')]
    private ?Game $game = null;

    #[ORM\OneToMany(mappedBy: 'player', targetEntity: Sprite::class, cascade: ['persist', 'remove'])]
    private Collection $sprites;

    #[ORM\OneToMany(mappedBy: 'player', targetEntity: UserLevel::class, cascade: ['persist', 'remove'])]
    private Collection $userLevels;

    #[ORM\OneToMany(targetEntity: UserPlayer::class, mappedBy: 'player')]
    private Collection $userPlayers;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $name_sprite = null;
    
    public function __construct()
    {
        $this->sprites = new ArrayCollection();
        $this->userLevels = new ArrayCollection();
        $this->userPlayers = new ArrayCollection();
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

    public function getSpeed(): ?float
    {
        return $this->speed;
    }

    public function setSpeed(?float $speed): static
    {
        $this->speed = $speed;
        return $this;
    }

    public function getJumpSpeed(): ?float
    {
        return $this->jumpSpeed;
    }

    public function setJumpSpeed(?float $jumpSpeed): static
    {
        $this->jumpSpeed = $jumpSpeed;
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

    /**
     * @return Collection<int, UserPlayer>
     */
    public function getUserPlayers(): Collection
    {
        return $this->userPlayers;
    }

    public function addUserPlayer(UserPlayer $userPlayer): static
    {
        if (!$this->userPlayers->contains($userPlayer)) {
            $this->userPlayers->add($userPlayer);
            $userPlayer->setPlayer($this);
        }

        return $this;
    }

    public function removeUserPlayer(UserPlayer $userPlayer): static
    {
        if ($this->userPlayers->removeElement($userPlayer)) {
            // set the owning side to null (unless already changed)
            if ($userPlayer->getPlayer() === $this) {
                $userPlayer->setPlayer(null);
            }
        }

        return $this;
    }

    public function getNameSprite(): ?string
    {
        return $this->name_sprite;
    }

    public function setNameSprite(?string $name_sprite): static
    {
        $this->name_sprite = $name_sprite;

        return $this;
    }


}
