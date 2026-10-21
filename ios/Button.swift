import SwiftUI

// Same semantic contract as the React Button: label, variant, disabled.
enum DSButtonVariant { case primary, outline, transparent }

struct DSButton: View {
    let label: String
    var variant: DSButtonVariant = .primary
    var isDisabled = false
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.system(size: DesignTokens.typographyParagraphMediumFontSize))
                .frame(minHeight: DesignTokens.densityHeightButton)
                .padding(.horizontal, DesignTokens.densityPaddingTouch)
                .foregroundColor(Color(variant == .primary ? DesignTokens.colorTextOnAction : DesignTokens.colorTextAction))
                .background(Color(variant == .primary ? DesignTokens.colorSurfaceAction : DesignTokens.colorSurfaceDefaultSecondary))
        }
        .disabled(isDisabled)
    }
}
