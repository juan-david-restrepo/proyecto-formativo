package com.reporteloya.recuperar_password.dto;

<<<<<<< HEAD
import com.reporteloya.recuperar_password.entity.Role;
=======
import com.reporteloya.recuperar_password.entity.Role; // Importar el Enum Role
>>>>>>> develop
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

<<<<<<< HEAD
=======
// Datos que se reciben del cliente para el registro
>>>>>>> develop
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

<<<<<<< HEAD
=======
    // 1. Campos adicionales del formulario
>>>>>>> develop
    private String tipoDocumento;
    private String numeroDocumento;
    private String nombreCompleto;

<<<<<<< HEAD
    private String email;
    private String password;
    private Role role;
}
=======
    // 2. Campo clave para Spring Security (se recomienda usar 'email' en lugar de
    // 'username')
    private String email;

    // 3. Contraseña (en texto plano antes de ser hasheada)
    private String password;

    // 4. Rol seleccionado por el usuario (si su lógica lo permite)
    private Role role;

    // NOTA: Si su Front-end no envía el rol y usted siempre quiere que
    // el usuario sea registrado como 'USER', puede eliminar esta línea
    // y asignar el rol de forma fija en el AuthService.
}
>>>>>>> develop
