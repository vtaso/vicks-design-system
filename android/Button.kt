package com.vick.designsystem.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.vick.designsystem.DesignTokens

// Same semantic contract as the React Button: label, variant, disabled.
enum class ButtonVariant { Primary, Outline, Transparent }

@Composable
fun DsButton(label: String, variant: ButtonVariant = ButtonVariant.Primary, enabled: Boolean = true, onClick: () -> Unit) {
    Button(
        onClick = onClick,
        enabled = enabled,
        modifier = Modifier.defaultMinSize(minHeight = DesignTokens.densityHeightButton),
        contentPadding = PaddingValues(horizontal = DesignTokens.densityPaddingTouch),
        border = if (variant == ButtonVariant.Outline) BorderStroke(DesignTokens.densityGapContainer / 8, DesignTokens.colorBorderAction) else null,
        colors = ButtonDefaults.buttonColors(
            containerColor = if (variant == ButtonVariant.Primary) DesignTokens.colorSurfaceAction else DesignTokens.colorSurfaceDefaultSecondary,
            contentColor = if (variant == ButtonVariant.Primary) DesignTokens.colorTextOnAction else DesignTokens.colorTextAction,
            disabledContainerColor = DesignTokens.colorSurfaceDisabled,
            disabledContentColor = DesignTokens.colorTextDisabled,
        ),
    ) { Text(label, fontSize = DesignTokens.typographyParagraphMediumFontSize) }
}
