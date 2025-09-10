<?php

namespace App\Entity;

use App\Repository\ItemRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ItemRepository::class)]
class Item
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 30)]
    private ?string $nombre = null;

    #[ORM\Column(length: 15)]
    private ?string $tipo = null;

    #[ORM\Column]
    private ?float $damage = null;

    #[ORM\OneToMany(targetEntity: UserItem::class, mappedBy: 'item')]
    private Collection $userItems;

    public function __construct()
    {
        $this->userItems = new ArrayCollection();
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

    public function getTipo(): ?string
    {
        return $this->tipo;
    }

    public function setTipo(string $tipo): static
    {
        $this->tipo = $tipo;

        return $this;
    }

    public function getDamage(): ?float
    {
        return $this->damage;
    }

    public function setDamage(float $damage): static
    {
        $this->damage = $damage;

        return $this;
    }

    /**
     * @return Collection<int, UserItem>
     */
    public function getUserItems(): Collection
    {
        return $this->userItems;
    }

    public function addUserItem(UserItem $userItem): static
    {
        if (!$this->userItems->contains($userItem)) {
            $this->userItems->add($userItem);
            $userItem->setItem($this);
        }

        return $this;
    }

    public function removeUserItem(UserItem $userItem): static
    {
        if ($this->userItems->removeElement($userItem)) {
            // set the owning side to null (unless already changed)
            if ($userItem->getItem() === $this) {
                $userItem->setItem(null);
            }
        }

        return $this;
    }

    public function __toString(): string
    {
        return $this->nombre;
    }
}
