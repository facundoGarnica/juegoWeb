<?php

namespace App\Repository;

use App\Entity\LevelEnemies;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<LevelEnemies>
 *
 * @method LevelEnemies|null find($id, $lockMode = null, $lockVersion = null)
 * @method LevelEnemies|null findOneBy(array $criteria, array $orderBy = null)
 * @method LevelEnemies[]    findAll()
 * @method LevelEnemies[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class LevelEnemiesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, LevelEnemies::class);
    }

//    /**
//     * @return LevelEnemies[] Returns an array of LevelEnemies objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('l')
//            ->andWhere('l.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('l.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?LevelEnemies
//    {
//        return $this->createQueryBuilder('l')
//            ->andWhere('l.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
