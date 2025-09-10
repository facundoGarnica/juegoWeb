<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[UniqueEntity(fields: ['username'], message: 'There is already an account with this username')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    private ?string $username = null;

    #[ORM\Column(type: "string")]
    private ?string $password = null;

    #[ORM\Column]
    private array $roles = [];

    #[ORM\OneToMany(targetEntity: UserItem::class, mappedBy: 'user_id')]
    private Collection $userItems;

    #[ORM\OneToMany(targetEntity: UserLevel::class, mappedBy: 'user')]
    private Collection $userLevels;

    #[ORM\OneToMany(targetEntity: Score::class, mappedBy: 'user')]
    private Collection $scores;

    #[ORM\OneToMany(targetEntity: Sprite::class, mappedBy: 'user_id')]
    private Collection $sprites;

    public function __construct()
    {
        $this->userItems = new ArrayCollection();
        $this->userLevels = new ArrayCollection();
        $this->scores = new ArrayCollection();
        $this->sprites = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    // 🔹 Interfaz PasswordAuthenticatedUserInterface
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    // 🔹 Interfaz UserInterface
    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;
        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->username;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;
        return $this;
    }

    public function eraseCredentials(): void
    {
        // Limpiar datos sensibles si existieran
    }

    // 🔹 Relaciones omitidas para acortar el ejemplo
    public function getUserItems(): Collection { return $this->userItems; }
    public function addUserItem(UserItem $userItem): static { /* ... */ return $this; }
    public function removeUserItem(UserItem $userItem): static { /* ... */ return $this; }

    public function getUserLevels(): Collection { return $this->userLevels; }
    public function addUserLevel(UserLevel $userLevel): static { /* ... */ return $this; }
    public function removeUserLevel(UserLevel $userLevel): static { /* ... */ return $this; }

    public function getScores(): Collection { return $this->scores; }
    public function addScore(Score $score): static { /* ... */ return $this; }
    public function removeScore(Score $score): static { /* ... */ return $this; }

    public function getSprites(): Collection { return $this->sprites; }
    public function addSprite(Sprite $sprite): static { /* ... */ return $this; }
    public function removeSprite(Sprite $sprite): static { /* ... */ return $this; }

    public function __toString(): string
    {
        return (string) $this->username;
    }
}
