package org.urbanmind.UrbanChats.Repository;


import org.urbanmind.UrbanChats.Entity.Reports;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReportsRepository extends JpaRepository<Reports, Long> {

    List<Reports> findByStatus(String status);
   

    Page<Reports> findByStatus(String status, Pageable pageable);

}

