<?php

namespace App\Entity;

use App\Repository\SavesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SavesRepository::class)]
class Saves
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?float $pos_x = null;

    #[ORM\Column]
    private ?float $pos_y = null;

    #[ORM\Column]
    private ?int $vidasRestantes = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $fecha_guardado = null;

    #[ORM\OneToMany(targetEntity: Score::class, mappedBy: 'saves')]
    private Collection $scores;

    #[ORM\ManyToOne(inversedBy: 'saves')]
    private ?Game $game = null;

    public function __construct()
    {
        $this->scores = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPosX(): ?float
    {
        return $this->pos_x;
    }

    public function setPosX(float $pos_x): static
    {
        $this->pos_x = $pos_x;

        return $this;
    }

    public function getPosY(): ?float
    {
        return $this->pos_y;
    }

    public function setPosY(float $pos_y): static
    {
        $this->pos_y = $pos_y;

        return $this;
    }

    public function getVidasRestantes(): ?int
    {
        return $this->vidasRestantes;
    }

    public function setVidasRestantes(int $vidasRestantes): static
    {
        $this->vidasRestantes = $vidasRestantes;

        return $this;
    }

    public function getFechaGuardado(): ?\DateTimeInterface
    {
        return $this->fecha_guardado;
    }

    public function setFechaGuardado(\DateTimeInterface $fecha_guardado): static
    {
        $this->fecha_guardado = $fecha_guardado;

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
            $score->setSaves($this);
        }

        return $this;
    }

    public function removeScore(Score $score): static
    {
        if ($this->scores->removeElement($score)) {
            // set the owning side to null (unless already changed)
            if ($score->getSaves() === $this) {
                $score->setSaves(null);
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
        return (string) $this->id;
    }
}
