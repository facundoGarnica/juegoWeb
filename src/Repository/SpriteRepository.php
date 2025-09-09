<?php

namespace App\Repository;

use App\Entity\Sprite;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Sprite>
 *
 * @method Sprite|null find($id, $lockMode = null, $lockVersion = null)
 * @method Sprite|null findOneBy(array $criteria, array $orderBy = null)
 * @method Sprite[]    findAll()
 * @method Sprite[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SpriteRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Sprite::class);
    }

//    /**
//     * @return Sprite[] Returns an array of Sprite objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('s.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Sprite
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
