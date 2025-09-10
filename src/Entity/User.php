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
#[UniqueEntity(fields: ['username'], message: 'Ya existe una cuenta con este nombre de usuario')]
#[UniqueEntity(fields: ['email'], message: 'Ya existe una cuenta con este email')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    private ?string $username = null;

    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

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

    #[ORM\OneToMany(targetEntity: Player::class, mappedBy: 'user')]
    private Collection $players;

    public function __construct()
    {
        $this->userItems = new ArrayCollection();
        $this->userLevels = new ArrayCollection();
        $this->scores = new ArrayCollection();
        $this->sprites = new ArrayCollection();
        $this->players = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    // 🔹 Email
    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    // 🔹 PasswordAuthenticatedUserInterface
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    // 🔹 UserInterface
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
        // 👇 Podés cambiar esto a $this->email si querés que el login sea por email
        return (string) $this->email;
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

    // 🔹 Relaciones omitidas para acortar
    public function getUserItems(): Collection { return $this->userItems; }
    public function getUserLevels(): Collection { return $this->userLevels; }
    public function getScores(): Collection { return $this->scores; }
    public function getSprites(): Collection { return $this->sprites; }

    public function __toString(): string
    {
        return (string) $this->username;
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
            $player->setUser($this);
        }

        return $this;
    }

    public function removePlayer(Player $player): static
    {
        if ($this->players->removeElement($player)) {
            // set the owning side to null (unless already changed)
            if ($player->getUser() === $this) {
                $player->setUser(null);
            }
        }

        return $this;
    }
}
