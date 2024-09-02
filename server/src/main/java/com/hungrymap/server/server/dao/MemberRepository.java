package com.hungrymap.server.server.dao;

import com.hungrymap.server.server.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MemberRepository extends JpaRepository<Member, String> {

    @EntityGraph(attributePaths = {"userRoleList"})
    @Query("select m from Member m where m.email = :email")
    Member getWithRoles(@Param("email") String username);

    @EntityGraph(attributePaths = {"userRoleList"})
    @Query("select m from Member m")
    Page<Member> getAllWithRoles(Pageable pageable);

    @EntityGraph(attributePaths = {"userRoleList"})
    @Query("select m from Member m")
    List<Member> getAllWithRoles();
}
