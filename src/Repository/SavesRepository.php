<?php

namespace App\Repository;

use App\Entity\Saves;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Saves>
 *
 * @method Saves|null find($id, $lockMode = null, $lockVersion = null)
 * @method Saves|null findOneBy(array $criteria, array $orderBy = null)
 * @method Saves[]    findAll()
 * @method Saves[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SavesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Saves::class);
    }

//    /**
//     * @return Saves[] Returns an array of Saves objects
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

//    public function findOneBySomeField($value): ?Saves
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
