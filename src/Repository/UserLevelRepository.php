<?php
namespace App\Repository;

use App\Entity\UserLevel;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UserLevel>
 *
 * @method UserLevel|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserLevel|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserLevel[]    findAll()
 * @method UserLevel[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserLevelRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserLevel::class);
    }

    /**
     * Obtiene los mejores UserLevel completados, ordenados por puntos descendentes
     *
     * @param int $limit Número máximo de resultados
     * @return UserLevel[]
     */
    public function findTopScores(int $limit = 4): array
    {
        return $this->createQueryBuilder('ul')
            ->andWhere('ul.completado = :val')
            ->setParameter('val', true)
            ->orderBy('ul.puntosObtenidos', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function findTopScoresByGame($game, int $limit = 4): array
    {
        return $this->createQueryBuilder('ul')
            ->join('ul.player', 'p')
            ->andWhere('ul.completado = :val')
            ->andWhere('p.game = :game')
            ->setParameter('val', true)
            ->setParameter('game', $game)
            ->orderBy('ul.puntosObtenidos', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function findPlayerLevelByUserAndLevel(int $playerId, int $levelId): ?UserLevel
    {
        return $this->createQueryBuilder('ul')
            ->join('ul.player', 'p')
            ->join('ul.level', 'l')
            ->andWhere('p.id = :playerId')
            ->andWhere('l.id = :levelId')
            ->setParameter('playerId', $playerId)
            ->setParameter('levelId', $levelId)
            ->getQuery()
            ->getOneOrNullResult();
    }

    // 🔹 MÉTODO CORREGIDO: Ahora usa la relación directa User
    public function findTopScoresByGameWithUsers($game, int $limit = 4): array
    {
        return $this->createQueryBuilder('ul')
            ->select('ul', 'p', 'u') // Solo las entidades necesarias
            ->join('ul.player', 'p')
            ->join('ul.user', 'u') // 🔹 JOIN directo al User que jugó ese nivel
            ->andWhere('ul.completado = :val')
            ->andWhere('p.game = :game')
            ->setParameter('val', true)
            ->setParameter('game', $game)
            ->orderBy('ul.puntosObtenidos', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}