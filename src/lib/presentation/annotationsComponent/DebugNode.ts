import { AnnotationNode, ColorProperty, ShapeProperty, type AnnotationShape, type Visibility, AnnotationProperty, type ImplementedProperties, type Color } from "@/presentation/annotationsComponent/objectAnnotationData"

export class DebugAnnotationNode extends AnnotationNode {
    private readonly colorProperty: ColorProperty
    private readonly shapeProperty: ShapeProperty

    constructor(
        id: string,
        label: string,
        children: DebugAnnotationNode[],
        initialColor: Color,
        initialShape: AnnotationShape,
        initialVisibility: Visibility = true
    ) {
        super(id, label, children)
        this.colorProperty = new ColorProperty(initialColor)
        this.shapeProperty = new ShapeProperty(initialShape)
        this.visibility.Value = initialVisibility
    }

    getProperties(): ReadonlyMap<string, AnnotationProperty<ImplementedProperties>> {
        return new Map<string, AnnotationProperty<ImplementedProperties>>([
            ['color', this.colorProperty],
            ['shape', this.shapeProperty],
            ['visibility', this.visibility]
        ])
    }

    updateProperty(propertyId: string, value: ImplementedProperties): void {
        switch (propertyId) {
            case 'color':
                this.colorProperty.Value = (value as Color)
                break
            case 'shape':
                this.shapeProperty.Value = (value as AnnotationShape)
                break
            case 'visibility':
                this.visibility.Value = (value as Visibility)
                break
            default:
                return
        }
        for (const child of this.children) {
            child.updateProperty(propertyId, value)
        }
    }

    updateVisibility(visibility: Visibility): void {
        this.visibility.Value = visibility
        for (const child of this.children) {
            child.updateVisibility(visibility)
        }
    }
}
