<?php
namespace App\Entity;

use App\Repository\UserLevelRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserLevelRepository::class)]
class UserLevel
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Player::class, inversedBy: 'userLevels')]
    private ?Player $player = null;

    #[ORM\ManyToOne(inversedBy: 'userLevels')]
    private ?Level $level = null;

    #[ORM\Column]
    private ?bool $completado = null;

    #[ORM\Column]
    private ?int $tiempo_usado = null;

    #[ORM\Column]
    private ?int $puntosObtenidos = null;

    #[ORM\ManyToOne(inversedBy: 'userLevels')]
    private ?Game $game = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'userLevels')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

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

    public function getLevel(): ?Level
    {
        return $this->level;
    }

    public function setLevel(?Level $level): static
    {
        $this->level = $level;
        return $this;
    }

    public function isCompletado(): ?bool
    {
        return $this->completado;
    }

    public function setCompletado(bool $completado): static
    {
        $this->completado = $completado;
        return $this;
    }

    public function getTiempoUsado(): ?int
    {
        return $this->tiempo_usado;
    }

    public function setTiempoUsado(int $tiempo_usado): static
    {
        $this->tiempo_usado = $tiempo_usado;
        return $this;
    }

    public function getPuntosObtenidos(): ?int
    {
        return $this->puntosObtenidos;
    }

    public function setPuntosObtenidos(int $puntosObtenidos): static
    {
        $this->puntosObtenidos = $puntosObtenidos;
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

    // 🔹 NUEVOS MÉTODOS para User
    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;
        return $this;
    }
}