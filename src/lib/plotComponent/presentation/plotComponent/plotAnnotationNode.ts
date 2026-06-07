import { ChangeChannelVisibilityCommand } from "@/plotComponent/application/commands/changeChannelVisibilityCommand"
import { AnnotationNode, AnnotationProperty, ColorProperty, ShapeProperty, VisibilityProperty, type AnnotationShape, type Color, type ImplementedProperties, type Visibility } from "@/plotComponent/presentation/annotationsComponent/objectAnnotationData"
import type { EventMediator } from "@/utils/eventMediator"


export class RootAnnotationNode extends AnnotationNode {
    visibility: VisibilityProperty = new VisibilityProperty(true)
    color: ColorProperty
    shape: ShapeProperty

    constructor(id: string, label: string, children: AnnotationNode[], color: ColorProperty, shape: ShapeProperty) {
        super(id, label, children)
        this.color = color
        this.shape = shape
    }

    getProperties(): ReadonlyMap<string, AnnotationProperty<ImplementedProperties>> {
        return new Map<string, AnnotationProperty<ImplementedProperties>>([
            ['color', this.color],
            ['shape', this.shape],
            ['visibility', this.visibility]]
        )
    }
    updateProperty(propertyId: string, value: ImplementedProperties): void {
        switch (propertyId) {
            case 'color':
                this.color.Value = (value as Color)
                break
            case 'shape':
                this.shape.Value = (value as AnnotationShape)
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

export class ChannelAnnotationNode extends RootAnnotationNode {
    eventMediator: EventMediator
    constructor(id: string, label: string, color: ColorProperty, shape: ShapeProperty, eventMediator: EventMediator) {
        super(id, label, [], color, shape)
        this.eventMediator = eventMediator
    }

    getProperties(): ReadonlyMap<string, AnnotationProperty<ImplementedProperties>> {
        return super.getProperties()
    }
    updateProperty(propertyId: string, value: ImplementedProperties): void {
        super.updateProperty(propertyId, value)
    }
    updateVisibility(visibility: Visibility): void {
        super.updateVisibility(visibility)
        this.eventMediator.publish(new ChangeChannelVisibilityCommand(this.label, visibility))
    }

}
