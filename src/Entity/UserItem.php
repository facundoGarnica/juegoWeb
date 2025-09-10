<?php

namespace App\Entity;

use App\Repository\UserItemRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\User;
use App\Entity\Item;

#[ORM\Entity(repositoryClass: UserItemRepository::class)]
class UserItem
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'userItems')]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: Item::class, inversedBy: 'userItems')]
    private ?Item $item = null;

    #[ORM\Column]
    private ?float $cantidad = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getItem(): ?Item
    {
        return $this->item;
    }

    public function setItem(?Item $item): static
    {
        $this->item = $item;
        return $this;
    }

    public function getCantidad(): ?float
    {
        return $this->cantidad;
    }

    public function setCantidad(float $cantidad): static
    {
        $this->cantidad = $cantidad;
        return $this;
    }
}
