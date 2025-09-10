<?php

namespace App\Entity;

use App\Repository\GameRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GameRepository::class)]
class Game
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $nombre = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $descripcion = null;

    #[ORM\Column(length: 10)]
    private ?string $version = null;

    #[ORM\Column]
    private ?bool $activo = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $imagen_portada = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $fecha_creacion = null;

    #[ORM\OneToMany(targetEntity: Score::class, mappedBy: 'game')]
    private Collection $scores;

    #[ORM\OneToMany(targetEntity: Saves::class, mappedBy: 'game')]
    private Collection $saves;

    #[ORM\OneToMany(targetEntity: Level::class, mappedBy: 'game')]
    private Collection $levels;

    #[ORM\OneToMany(targetEntity: UserLevel::class, mappedBy: 'game')]
    private Collection $userLevels;

    #[ORM\OneToMany(targetEntity: Enemies::class, mappedBy: 'game')]
    private Collection $enemies;

    #[ORM\OneToMany(targetEntity: Sprite::class, mappedBy: 'game')]
    private Collection $sprites;

    #[ORM\OneToMany(targetEntity: Player::class, mappedBy: 'games')]
    private Collection $players;

    public function __construct()
    {
        $this->scores = new ArrayCollection();
        $this->saves = new ArrayCollection();
        $this->levels = new ArrayCollection();
        $this->userLevels = new ArrayCollection();
        $this->enemies = new ArrayCollection();
        $this->sprites = new ArrayCollection();
        $this->players = new ArrayCollection();
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

    public function getVersion(): ?string
    {
        return $this->version;
    }

    public function setVersion(string $version): static
    {
        $this->version = $version;

        return $this;
    }

    public function isActivo(): ?bool
    {
        return $this->activo;
    }

    public function setActivo(bool $activo): static
    {
        $this->activo = $activo;

        return $this;
    }

    public function getImagenPortada(): ?string
    {
        return $this->imagen_portada;
    }

    public function setImagenPortada(?string $imagen_portada): static
    {
        $this->imagen_portada = $imagen_portada;

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

    /**
     * @return Collection<int, Score>
     */
    public function getScores(): Collection
    {
        return $this->scores;
    }

    public function addScore(Score $score): static
    {
        if (!$this->scores->contains($score)) {
            $this->scores->add($score);
            $score->setGame($this);
        }

        return $this;
    }

    public function removeScore(Score $score): static
    {
        if ($this->scores->removeElement($score)) {
            // set the owning side to null (unless already changed)
            if ($score->getGame() === $this) {
                $score->setGame(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Saves>
     */
    public function getSaves(): Collection
    {
        return $this->saves;
    }

    public function addSave(Saves $save): static
    {
        if (!$this->saves->contains($save)) {
            $this->saves->add($save);
            $save->setGame($this);
        }

        return $this;
    }

    public function removeSave(Saves $save): static
    {
        if ($this->saves->removeElement($save)) {
            // set the owning side to null (unless already changed)
            if ($save->getGame() === $this) {
                $save->setGame(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Level>
     */
    public function getLevels(): Collection
    {
        return $this->levels;
    }

    public function addLevel(Level $level): static
    {
        if (!$this->levels->contains($level)) {
            $this->levels->add($level);
            $level->setGame($this);
        }

        return $this;
    }

    public function removeLevel(Level $level): static
    {
        if ($this->levels->removeElement($level)) {
            // set the owning side to null (unless already changed)
            if ($level->getGame() === $this) {
                $level->setGame(null);
            }
        }

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
            $userLevel->setGame($this);
        }

        return $this;
    }

    public function removeUserLevel(UserLevel $userLevel): static
    {
        if ($this->userLevels->removeElement($userLevel)) {
            // set the owning side to null (unless already changed)
            if ($userLevel->getGame() === $this) {
                $userLevel->setGame(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Enemies>
     */
    public function getEnemies(): Collection
    {
        return $this->enemies;
    }

    public function addEnemy(Enemies $enemy): static
    {
        if (!$this->enemies->contains($enemy)) {
            $this->enemies->add($enemy);
            $enemy->setGame($this);
        }

        return $this;
    }

    public function removeEnemy(Enemies $enemy): static
    {
        if ($this->enemies->removeElement($enemy)) {
            // set the owning side to null (unless already changed)
            if ($enemy->getGame() === $this) {
                $enemy->setGame(null);
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
            $sprite->setGame($this);
        }

        return $this;
    }

    public function removeSprite(Sprite $sprite): static
    {
        if ($this->sprites->removeElement($sprite)) {
            // set the owning side to null (unless already changed)
            if ($sprite->getGame() === $this) {
                $sprite->setGame(null);
            }
        }

        return $this;
    }

    public function __toString(): string
    {
        return $this->nombre;
    }

    /**
     * @return Collection<int, Player>
     */
    public function getPlayers(): Collection
    {
        return $this->players;
    }

    public function addPlayer(Player $player): static
    {
        if (!$this->players->contains($player)) {
            $this->players->add($player);
            $player->setGames($this);
        }

        return $this;
    }

    public function removePlayer(Player $player): static
    {
        if ($this->players->removeElement($player)) {
            // set the owning side to null (unless already changed)
            if ($player->getGames() === $this) {
                $player->setGames(null);
            }
        }

        return $this;
    }
}
